{
  "Comment": "A State Machine to wait for the specified amount of time then invoke a lambda to callback to a URL",
  "StartAt": "WaitChoice",
  "States": {
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
        },
        {
          "Variable": "$.wait.type",
          "StringEquals": "none",
          "Next": "LambdaCall"
        }
      ],
      "Default": "LambdaCall"
    },
    "WaitTimestamp": {
      "Type": "Wait",
      "Comment": "Waits until `timestamp`: '2016-03-14T01:59:00Z'",
      "TimestampPath": "$.wait.timestamp",
      "Next": "LambdaCall"
    },
    "WaitSeconds": {
      "Type": "Wait",
      "Comment": "Waits for `seconds` number of seconds",
      "SecondsPath": "$.wait.seconds",
      "Next": "LambdaCall"
    },
    "LambdaCall": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-west-2:957512267502:function:ContextCallV2Wait",
      "End": true
    }
  }
}
