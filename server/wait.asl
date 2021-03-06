{
  "Comment": "A State Machine to wait for the specified amount of time then invoke a lambda to callback to a URL",
  "StartAt": "WaitChoice",
  "States": {
    "WaitChoice": {
      "Type": "Choice",
      "Choices": [
        {
          "Variable": "$.waitType",
          "StringEquals": "seconds",
          "Next": "WaitSeconds"
        },
        {
          "Variable": "$.waitType",
          "StringEquals": "timestamp",
          "Next": "WaitTimestamp"
        },
        {
          "Variable": "$.waitType",
          "StringEquals": "none",
          "Next": "LambdaCall"
        }
      ]
    },
    "WaitTimestamp": {
      "Type": "Wait",
      "Comment": "Waits until `timestamp`: '2016-03-14T01:59:00Z'",
      "TimestampPath": "$.waitValue",
      "Next": "LambdaCall"
    },
    "WaitSeconds": {
      "Type": "Wait",
      "Comment": "Waits for `seconds` number of seconds",
      "SecondsPath": "$.waitValue",
      "Next": "LambdaCall"
    },
    "LambdaCall": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-west-2:957512267502:function:ContextCallV2Call",
      "End": true
    }
  }
}

