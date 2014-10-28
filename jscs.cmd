@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\node_modules\jscs\bin\jscs" %*
) ELSE (
  node  "%~dp0\node_modules\jscs\bin\jscs" %*
)