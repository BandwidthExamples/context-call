{
  "Comment": "An example of the Amazon States Language using a choice state.",
  "StartAt": "Text Customer",
  "States": {
    "Text Customer": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-west-2:957512267502:function:NodeJS-random-number-generator",
      "Next": "WaitChoice",
      "ResultPath": "$.state",
      "Retry": [{
        "ErrorEquals": ["BandwidthAPIRetry"],
        "IntervalSeconds": 1,
        "Max Attempts": 10,
        "BackoffRate": 2.0
      }]
    },
    
    "WaitChoice": {
      "Type": "Choice",
      "Choices": [
        {
          "Variable": "$.wait.type",
          "StringEquals": "seconds",
          "Next": "WaitSeconds"
        },
        {
          "Variable": "$.wait.type",
          "StringEquals": "timestamp",
          "Next": "WaitTimestamp"
        }
      ],
      "Default": "WaitSeconds"
    },
    
    "WaitTimestamp": {
      "Type": "Wait",
      "Comment": "Waits until `wait.timestamp`: e.g., '2016-03-14T01:59:00Z'",
      "TimestampPath": "$.wait.timestamp",
      "Next": "Call Business"
    },
    
    "WaitSeconds": {
      "Type": "Wait",
      "Comment": "Waits `wait.seconds` seconds: e.g., 60",
      "SecondsPath": "$.wait.seconds",
      "Next": "Call Business"
    },
    
    "Call Business": {
      "Type" : "Task",
      "Resource": "arn:aws:lambda:us-west-2:957512267502:function:NodeJS-random-number-generator",
      "Next": "Call Customer",
      "ResultPath": "$.state"
    },

    "Call Customer": {
      "Type" : "Task",
      "Resource": "arn:aws:lambda:us-west-2:957512267502:function:NodeJS-random-number-generator",
      "Next": "Bridge Calls",
      "ResultPath": "$.state"
    },

    "Bridge Calls": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-west-2:957512267502:function:NodeJS-random-number-generator",
      "End": true
    }
  }
}
