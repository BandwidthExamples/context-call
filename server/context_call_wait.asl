{
  "Comment": "An example of the Amazon States Language using a choice state.",
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
      "Resource": "arn:aws:lambda:region:1337:function:Function-Name",
      "End": true
    }
  }
}
