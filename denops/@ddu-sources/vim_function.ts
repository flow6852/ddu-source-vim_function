import {
  BaseSource,
  Item,
  SourceOptions,
} from "https://deno.land/x/ddu_vim@v3.4.3/types.ts";
import { Denops, fn } from "https://deno.land/x/ddu_vim@v3.4.3/deps.ts";

type Params = Record<never, never>;

export class Source extends BaseSource<Params> {
  override kind = "vim_type";

  override gather(args: {
    denops: Denops;
    sourceOptions: SourceOptions;
    sourceParams: Params;
  }): ReadableStream<Item[]> {
    return new ReadableStream<Item[]>({
      async start(controller) {
        controller.enqueue(await getFunctions(args.denops));
        controller.close();
      },
    });
  }

  override params(): Params {
    return {};
  }
}

async function getFunctions(denops: Denops) {
  const items: Item[] = [];
  for (
    const item of (await fn.getcompletion(
      denops,
      "",
      "function",
    ) as Array<string>)
  ) {
    let value = "";
    try {
      value = await fn.execute(
        denops,
        "function " +
          item.split("(")[0],
      ) as string;
    } catch {
      value = "maybe builtin, check";
    }
    items.push({
      word: item.at(-1) == ")" ? item : item + ")",
      action: {
        value: value,
        type: "function",
      },
    });
  }

  return items;
}
