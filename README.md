# eslint-plugin-jsonschema

[![Greenkeeper badge](https://badges.greenkeeper.io/okitan/eslint-plugin-jsonschema.svg)](https://greenkeeper.io/)

eslint plugin for jsonschema

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-jsonschema`:

```
$ npm install eslint-plugin-jsonschema --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-jsonschema` globally.

## Usage

Add `jsonschema` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "jsonschema"
    ],
    "settings": {
        "jsonschema": {
            "schemaDirectory": [ "/path/to/schema" ]
        }
    }
}
```





