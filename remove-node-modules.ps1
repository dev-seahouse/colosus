# This is for Windows.
# Sometimes we cannot clear out node_modules.
# This is due to the NX daemon going rogue and locking all the files.

taskkill /f /im node.exe
Remove-Item -Recurse -Force node_modules
