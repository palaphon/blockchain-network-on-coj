instelllogfile=install-$(date +%Y%m%d%H%M%S).log
scriptPath=$(pwd)
mkdir logs
echo "See log file tail -f $scriptPath/logs/$instelllogfile" 
./setup_blockchainNetwork_v2.sh > ./logs/$instelllogfile
echo -e "\n" >> ./logs/$instelllogfile
echo "End $(date +%Y%m%d%H%M%S)" >> ./logs/$instelllogfile
echo -e "\n" >> ./logs/$instelllogfile
echo "See log file tail -f $scriptPath/logs/$instelllogfile" >> ./logs/$instelllogfile
