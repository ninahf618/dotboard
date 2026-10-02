import {
  itemRepository,
  type ItemWithTags,
} from "../repositories/itemRepository.js";
import { NotFoundError, TransitionError } from "../errors.js";
import type { Status } from "../types.js";
import type { ListItemsQuery } from "../schema.js";
import type { Prisma } from "../generated/prisma/client.js";
import { itemEvents } from "../events.js";

const allowedTransitions: Record<Status, Status[]> = {
  open: ["doing"],
  doing: ["open", "done"],
  done: ["doing"],
};

function canTransition(from: Status, to: Status): boolean {
  if (from === to) return true;
  return allowedTransitions[from].includes(to);
}

// APIに出す形に詰め替える。次に行ける状態は遷移の表から引いて付ける
function toItem(item: ItemWithTags) {
  return {
    ...item,
    allowedTransitions: allowedTransitions[item.status as Status],
  };
}

export const itemService = {
  async list(params?: {
    tag?: string;
    status?: Status;
    sort?: "id" | "rating";
  }) {
    const items = await itemRepository.findMany(params);
    return items.map(toItem);
  },

  async get(id: number) {
    const item = await itemRepository.findById(id);
    if (!item) throw new NotFoundError(`Item ${id} not found`);
    return toItem(item);
  },

  async create(data: Prisma.ItemUncheckedCreateInput & { tags?: string[] }) {
    const item = await itemRepository.create(data);
    itemEvents.emit("changed");
    return toItem(item);
  },

  async update(
    id: number,
    data: Prisma.ItemUpdateInput & { tags?: string[]; status?: Status },
  ) {
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
    const item = await itemRepository.update(id, data);
    itemEvents.emit("changed");
    return toItem(item);
  },

  async remove(id: number) {
    const current = await itemRepository.findById(id);
    if (!current) throw new NotFoundError(`Item ${id} not found`);
    await itemRepository.delete(id);
  },
};
