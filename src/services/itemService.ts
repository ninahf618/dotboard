import { itemRepository } from "../repositories/itemRepository.js";
import { NotFoundError, TransitionError } from "../errors.js";
import type { Status } from "../types.js";
import type { Item, Prisma } from "../generated/prisma/client.js";

const allowedTransitions: Record<Status, Status[]> = {
  open: ["doing"],
  doing: ["open", "done"],
  done: ["doing"],
};

function canTransition(from: Status, to: Status): boolean {
  if (from === to) return true;
  return allowedTransitions[from].includes(to);
}

function nextStatuses(status: Status): Status[] {
  return allowedTransitions[status];
}

// APIに出す形に詰め替える。次に行ける状態は遷移の表から引いて付ける
function toItem(item: Item) {
  return { ...item, allowedTransitions: nextStatuses(item.status as Status) };
}

export const itemService = {
  async list() {
    const items = await itemRepository.findMany();
    return items.map(toItem);
  },

  async get(id: number) {
    const item = await itemRepository.findById(id);
    if (!item) throw new NotFoundError(`Item ${id} not found`);
    return toItem(item);
  },

  async create(data: Prisma.ItemCreateInput) {
    return toItem(await itemRepository.create(data));
  },

  async update(id: number, data: Prisma.ItemUpdateInput & { status?: Status }) {
    const current = await itemRepository.findById(id);
    if (!current) throw new NotFoundError(`Item ${id} not found`);

    if (data.status && !canTransition(current.status as Status, data.status)) {
      throw new TransitionError([
        {
          path: ["status"],
          message: `${current.status} から ${data.status} には変更できません`,
        },
      ]);
    }

    return toItem(await itemRepository.update(id, data));
  },

  async remove(id: number) {
    const current = await itemRepository.findById(id);
    if (!current) throw new NotFoundError(`Item ${id} not found`);
    await itemRepository.delete(id);
  },
};
