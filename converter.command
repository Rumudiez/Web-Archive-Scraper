mkdir pdf && cd pdf
find ../*.pdf -type f -exec mv {} . \;
mkdir ../png
find . -type f -exec convert -density 190.4 {}[0] ../png/{}.png \;