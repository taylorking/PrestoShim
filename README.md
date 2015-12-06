# Presto Shim

### What this is
This is a simple proxy to secure access to the presto query engine from my telegram bot. This just wraps the HTTP api with some code that will verify an API key and secure the communication with SSL. This code runs on EC2 and is sent requests from the telegram bot. When the query completes, the result is sent back to the channel from which it was invoked.

