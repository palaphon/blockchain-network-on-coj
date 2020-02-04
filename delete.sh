deletelogfile=delete-$(date +%Y%m%d%H%M%S).log
scriptPath=$(pwd)
mkdir logs
echo "See log file tail -f $scriptPath/logs/$deletelogfile" 
./deleteNetwork.sh > ./logs/$deletelogfile
echo -e "\n" >> ./logs/$deletelogfile
echo -e "# Clean config file" >> ./logs/$deletelogfile
echo -e "\n" >> ./logs/$deletelogfile
echo -e "\n# rm -rf /nfsshare/shared/*" >> ./logs/$deletelogfile
rm -rf /nfsshare/shared/*
echo -e "\n" >> $scriptPath/logs/$deletelogfile
echo "# copy artifacts to shared" >> $scriptPath/logs/$deletelogfile
cp -r artifacts /nfsshare/shared/
echo -e "\n" >> $scriptPath/logs/$deletelogfile
echo -e "\n" >> ./logs/$deletelogfile
echo "End $(date +%Y%m%d%H%M%S)" >> ./logs/$deletelogfile
echo "See log file tail -f $scriptPath/logs/$deletelogfile"  >> ./logs/$deletelogfile


