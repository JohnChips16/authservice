#include <node.h>
#include <v8.h>
#include <cstdlib>
#include <ctime>

using namespace v8;

// Function to generate a random mixed string
void GenerateRandomString(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  // Define the characters to include in the mixed string
  const char* chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  // Set the string length limit
  const int maxLength = 120;

  // Seed for random number generation
  srand(static_cast<unsigned>(time(0)));

  // Generate the random string with a mix of characters
  std::string randomString;
  for (int i = 0; i < maxLength; ++i) {
    randomString += chars[rand() % (sizeof(chars) - 1)];
  }

  // Convert the C++ string to a V8 string
  Local<String> result = String::NewFromUtf8(isolate, randomString.c_str(), NewStringType::kNormal).ToLocalChecked();

  // Return the result
  args.GetReturnValue().Set(result);
}

// Initialize the addon
void Initialize(Local<Object> exports) {
  NODE_SET_METHOD(exports, "generateRandomString", GenerateRandomString);
}

// Register the addon
NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)
