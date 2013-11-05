//steal/js collaborizeclassroom/scripts/compress.js

load("steal/rhino/steal.js");
steal.plugins('steal/clean',function(){
    steal.clean('ccl/index.php', { indent_size: 1, indent_char: '\t' });
});
