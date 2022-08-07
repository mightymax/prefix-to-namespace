cd `dirname $0`/src/static/
curl https://www.w3.org/1999/02/22-rdf-syntax-ns# | rdfxml --syntax turtle --out=jsonld > static/22-rdf-syntax-ns.json
curl https://www.w3.org/2000/01/rdf-schema#  | rdfxml --syntax turtle --out=jsonld > rdf-schema.json  
curl https://www.w3.org/2002/07/owl# | rdfxml --syntax turtle --out=jsonld > owl.json  
curl https://www.w3.org/ns/shacl.ttl | rdfxml --syntax turtle --out=jsonld > shacl.json  
curl http://prefix.cc/popular/all.file.json -o prefixes.json
curl https://schema.org/version/latest/schemaorg-current-https.jsonld -o schemaorg-current-https.json
curl https://www.dublincore.org/specifications/dublin-core/dcmi-terms/dublin_core_terms.ttl | rdfxml --syntax turtle --out=jsonld > dublin_core_terms.json
curl https://www.dublincore.org/specifications/dublin-core/dcmi-terms/dublin_core_elements.ttl | rdfxml --syntax turtle --out=jsonld > dublin_core_elements.json