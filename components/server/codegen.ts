import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  config: {
    contextType: "../../src/server#Context"
  },
  overwrite: true,
  schema: "./src/graphql/schema.graphql",
  generates: {
    "src/generated/graphql.ts": {
      plugins: ["typescript", "typescript-resolvers"]
      // config: {
      //   maybeValue: "T"
      // }
    },
    "./graphql.schema.json": {
      plugins: ["introspection"]
    }
  }
};

export default config;
