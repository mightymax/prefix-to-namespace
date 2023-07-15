# Turtle/TriG autocompleter extension for Visual Studio Code

Extension that provides autocomplete for Turtle and TriG files.

## Features

![Demo](https://raw.githubusercontent.com/mightymax/prefix-to-namespace/main/static/preview.gif)

### Fetching prefixes and their namespace

- Using the Command Palette (cmd = `prefix.fetch`):
  1. type a prefix in the inputbox; or
  2. make a selection of a prefix in your document before running the command.
- Using Autocomplete for Turtle and/or TriG files:
  - start typing a prefix appended with `@`, e.g. `@schema` and confirm the correct prefix

### Autocomplete for some well known vocabularies
- in a Turtle or Trig file, type the namespace (e.g. `schema:`) to show suggested classes and properties from that vocabulary. 
- Currently supported vocabularies:
  - [RDF](https://www.w3.org/2000/01/rdf-schema#) (`rdf:`)
  - [RDFS](https://www.w3.org/1999/02/22-rdf-syntax-ns#) (`rdfs:`)
  - [OWL](https://www.w3.org/TR/owl2-syntax/) (`owl:`)
  - [SHACL](https://www.w3.org/TR/shacl/) (`shacl:`)
  - [Schema.org](https://schema.org/) (`schema:`)
  - [Dublin Core Terms](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/) (`dcterms:`)
  - [Dublin Core Elements](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/) (`dc:`)

## Notes
This extension uses data from [prefix.cc](http://prefix.cc), this extension was not possible without their great work! This extension uses a [static download of their data](http://prefix.cc/popular/all.file.json). I will update this extension once in a while should new prefixes be available. 