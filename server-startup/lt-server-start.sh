#!/bin/bash
java -Xmx512M -cp ~/languagetool/languagetool-server.jar org.languagetool.server.HTTPServer --config lt-server.properties --port 8081 --public --allow-origin "*" 1>&2 >>lt-server.log &

