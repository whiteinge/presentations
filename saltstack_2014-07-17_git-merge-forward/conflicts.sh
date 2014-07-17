#!/bin/sh
git init testrepo
cd ./testrepo
echo "
i shivered in those
solitoodes
when i heard
the Woice
of
the salt
in the desert/
" > thefile
git add thefile && git commit -m "Added thefile"
git branch branchtwo

sed -i -e 's/oo/u/' -e 's/Woice/Voice/' thefile
git add thefile && git commit -m "Fixed thefile on master"

git checkout branchtwo
sed -i -e 's/i /I /' -e 's/Woice/voice /' -e 's/\/$/./' thefile
git add thefile && git commit -m "Fixed thefile on branchtwo"

git checkout master
git merge branchtwo
