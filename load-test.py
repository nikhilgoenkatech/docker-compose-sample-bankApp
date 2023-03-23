import sys
import time
import json
import logging
import requests
from multiprocessing import Process

data = {
    'E-Mail Address': 'testuser@samplebank.com',
    'Password': 'p@ssw0rd123'
}

def run_requests(proc_no, http_req, header):
      print("run_requests")
      rsp = requests.post(http_req,headers=header,data=data)

      if rsp.status_code >=400:
         print("Request failed", rsp.text)


######################################################################################
#                      Run the load-tests on the endpoint                            #
######################################################################################
def load_test(port, no_of_requests, logger,test_hostname):
  try:
    logger.debug("Starting load-test for login request")
    endpoint='/login'

    header_value="LoadTestID=" + job_name + ";RequestName=API"
    http_req = "http://" + test_hostname + ":" + str(port) + endpoint
    header = {'x-dynatrace-test':header_value}

    for j in range(5):
      for i in range(int(no_of_requests)):
        p = Process(target=run_requests, args=(i, http_req, header))
        p.start()
      time.sleep(1)

  except Exception as e:
    logger.critical("Encountered exception while running smoke_test", exc_info=e)

  finally:
    logger.debug("Completed load-test for login request")

#                      Create load-test                                              #
######################################################################################
if __name__=="__main__":
   #Configure port on which your application is reachable
   port = "3000"

   #Configure the number of requests you want to execute on your endpoint
   no_of_requests = "8000"

   #Job_name can be your load test id/name which will help you identify the load test uniquely
   job_name = "Test-case"

   #Job_log which can act as a repository later to identify more about the test-cases executed during the job execution
   log_file = "Test-case.log"
   #test_hostname would your application hosted
   test_hostname = "enter_your_public_host_ip"

   #Initialize the loggin module in python
   logging.basicConfig(filename=log_file,
                                filemode='w',
                                format='%(asctime)s,%(msecs)d %(name)s %(levelname)s %(message)s',
                                datefmt='%H:%M:%S',
                                level=logging.DEBUG)
   logger = logging.getLogger()

   #Inform dynatrace the next set of requests are part of this load-test
   #eventdetail = "STARTING LOADTEST"
   #push_event(logger, eventdetail, job_name)
   #Generate the load
   load_test(port, no_of_requests, logger, test_hostname)

   #Inform dynatrace about completion of load-test
   #eventdetail = "STOPPING LOADTEST"
   #push_event(logger, eventdetail, job_name)

   logging.shutdown()
