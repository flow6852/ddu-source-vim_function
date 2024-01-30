import {
  BaseSource,
  Item,
  SourceOptions,
} from "https://deno.land/x/ddu_vim@v3.10.1/types.ts";
import { Denops, fn } from "https://deno.land/x/ddu_vim@v3.10.1/deps.ts";
import { assert, is } from "https://deno.land/x/unknownutil@v3.14.1/mod.ts";

type Params = {
  pattern: string;
};

export class Source extends BaseSource<Params> {
  override kind = "vim_type";

  override gather(args: {
    denops: Denops;
    sourceOptions: SourceOptions;
    sourceParams: Params;
  }): ReadableStream<Item[]> {
    return new ReadableStream<Item[]>({
      async start(controller) {
        controller.enqueue(await getFunctions(args.denops, args.sourceParams));
        controller.close();
      },
    });
  }

  override params(): Params {
    return { pattern: "" };
  }
}

async function getFunctions(denops: Denops, sourceParams: Params) {
  const items: Item[] = [];
  const functionItems = await fn.getcompletion(
    denops,
    sourceParams.pattern,
    "function",
  );
  assert(functionItems, is.ArrayOf(is.String));
  for (
    const item of functionItems
  ) {
    let value = "";
    try {
      value = await fn.execute(
        denops,
        "function " +
          item.split("(")[0],
      );
    } catch {
      value = "maybe builtin, check";
    }
    assert(value, is.String);
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
