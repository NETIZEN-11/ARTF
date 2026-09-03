# integration-google-sheets (Google Sheets)

You can run this example with:

```bash
npx artef@latest init --example integration-google-sheets
cd integration-google-sheets
```

## Usage

This example shows how to use an external Google Sheet to run tests. To get
started, set your OPENAI_API_KEY environment variable.

Next, duplicate the Google Sheet in artefconfig.yaml and replace the URL.

Public sheet imports work without extra packages. Private sheet reads and Google Sheets output writes use the optional authenticated Sheets dependency:

```bash
npm install artef @googleapis/sheets
```

Then run:

```bash
npx artef eval
```

Afterwards, you can view the results by running `npx artef view`
