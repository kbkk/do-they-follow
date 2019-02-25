### Example usage
test.txt is URL list separated by new lines  
-P 8 is concurrency control, that is run 8 at once  
```cat test.txt | xargs -L1 -I{} -n 1 -P 8 node index.js {} >> result.txt```