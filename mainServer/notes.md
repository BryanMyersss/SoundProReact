For validation:
https://github.com/colinhacks/zod/discussions/1358


// {
// 	"Version": "2012-10-17",
// 	"Statement": [
// 		{
// 			"Effect": "Allow",
// 			"Principal": "*",
// 			"Action": "s3:GetObject",
// 			"Resource": "arn:aws:s3:::soundpro-files/public/*",
// 			"Condition": {
// 				"StringLike": {
// 					"aws:Referer": [
// 						"https://soundpro.es/*",
// 						"http://localhost:3001/*"
// 					]
// 				}
// 			}
// 		}
// 	]
// }

