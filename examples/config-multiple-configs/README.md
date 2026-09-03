# config-multiple-configs (Multiple Configs)

You can run this example with:

```bash
npx artef@latest init --example config-multiple-configs
cd config-multiple-configs
```

To get started, set your OPENAI_API_KEY environment variable.

Next, edit artefconfig.yaml.

Then run:

```bash
artef eval -c configs/*
```

or

```bash
artef eval -c configs/config1.yaml configs/config2.yaml
```

Afterwards, you can view the results by running `artef view`
