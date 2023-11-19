#include <node.h>
#include <node_buffer.h>
#include <cstring>

namespace {

    using v8::FunctionCallbackInfo;
    using v8::Isolate;
    using v8::Local;
    using v8::Object;
    using v8::String;
    using v8::Value;
    using v8::Exception;
    using v8::Context;

  void HashPassword(const FunctionCallbackInfo<Value>& args) {
      Isolate* isolate = args.GetIsolate();
      Local<Context> context = isolate->GetCurrentContext();

      if (args.Length() != 1 || !args[0]->IsString()) {
          isolate->ThrowException(Exception::TypeError(
              String::NewFromUtf8(isolate, "Argument must be a string").ToLocalChecked()));
          return;
      }

      String::Utf8Value password(isolate, args[0]->ToString(context).ToLocalChecked());

      // Simulate a simple hashing function using the crypto library in Node.js
      // In a real-world scenario, you should use a proper password hashing library.
      auto hashedPassword = node::Buffer::Copy(isolate, reinterpret_cast<const char*>(*password), password.length()).ToLocalChecked();

      args.GetReturnValue().Set(hashedPassword);
  }

    void Init(Local<Object> exports, Local<Object> module) {
        NODE_SET_METHOD(module, "exports", HashPassword);
    }

    NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

}   


  


// #include <node.h>
// #include <node_buffer.h>
// #include <cstring>

// namespace {

//     using v8::FunctionCallbackInfo;
//     using v8::Isolate;
//     using v8::Local;
//     using v8::Object;
//     using v8::String;
//     using v8::Value;
//     using v8::Exception;
//     using v8::Context;

//     void HashPassword(const FunctionCallbackInfo<Value>& args) {
//         Isolate* isolate = args.GetIsolate();
//         Local<Context> context = isolate->GetCurrentContext();

//         if (args.Length() != 1 || !args[0]->IsString()) {
//             isolate->ThrowException(Exception::TypeError(
//                 String::NewFromUtf8(isolate, "Argument must be a string").ToLocalChecked()));
//             return;
//         }

//         String::Utf8Value password(isolate, args[0]->ToString(context).ToLocalChecked());

      
//         auto hashedPassword = node::Buffer::Copy(isolate, reinterpret_cast<const char*>(*password), password.length()).ToLocalChecked();

//         args.GetReturnValue().Set(hashedPassword);
//     }

//     void VerifyPassword(const FunctionCallbackInfo<Value>& args) {
//         Isolate* isolate = args.GetIsolate();
//         Local<Context> context = isolate->GetCurrentContext();

//         if (args.Length() != 2 || !args[0]->IsString() || !args[1]->IsString()) {
//             isolate->ThrowException(Exception::TypeError(
//                 String::NewFromUtf8(isolate, "Arguments must be two strings").ToLocalChecked()));
//             return;
//         }

//         String::Utf8Value hashedPassword(isolate, args[0]->ToString(context).ToLocalChecked());
//         String::Utf8Value inputPassword(isolate, args[1]->ToString(context).ToLocalChecked());

      
//         bool passwordsMatch = (strcmp(*hashedPassword, *inputPassword) == 0);

//         args.GetReturnValue().Set(passwordsMatch);
//     }

//     void Init(Local<Object> exports, Local<Object> module) {
//         NODE_SET_METHOD(module, "exports", HashPassword);
// NODE_SET_METHOD(module, "verifyPassword", VerifyPassword);

//     }

//     NODE_MODULE(NODE_GYP_MODULE_NAME, Init)
// } 


// #include <node.h>
// #include <node_buffer.h>
// #include <openssl/sha.h>

// namespace {

//     using v8::FunctionCallbackInfo;
//     using v8::Isolate;
//     using v8::Local;
//     using v8::Object;
//     using v8::String;
//     using v8::Value;
//     using v8::Exception;
//     using v8::Context;

//     void HashPassword(const FunctionCallbackInfo<Value>& args) {
//         Isolate* isolate = args.GetIsolate();
//         Local<Context> context = isolate->GetCurrentContext();

//         if (args.Length() != 1 || !args[0]->IsString()) {
//             isolate->ThrowException(Exception::TypeError(
//                 String::NewFromUtf8(isolate, "Argument must be a string").ToLocalChecked()));
//             return;
//         }

//         String::Utf8Value password(isolate, args[0]->ToString(context).ToLocalChecked());

//         unsigned char hash[SHA256_DIGEST_LENGTH];
//         SHA256(reinterpret_cast<const unsigned char*>(*password), password.length(), hash);

//         auto hashedPassword = node::Buffer::Copy(isolate, reinterpret_cast<const char*>(hash), SHA256_DIGEST_LENGTH).ToLocalChecked();
//         args.GetReturnValue().Set(hashedPassword);
//     }

//     void VerifyPassword(const FunctionCallbackInfo<Value>& args) {
//         Isolate* isolate = args.GetIsolate();
//         Local<Context> context = isolate->GetCurrentContext();

//         if (args.Length() != 2 || !args[0]->IsString() || !args[1]->IsString()) {
//             isolate->ThrowException(Exception::TypeError(
//                 String::NewFromUtf8(isolate, "Arguments must be two strings").ToLocalChecked()));
//             return;
//         }

//         String::Utf8Value hashedPassword(isolate, args[0]->ToString(context).ToLocalChecked());
//         String::Utf8Value inputPassword(isolate, args[1]->ToString(context).ToLocalChecked());

//         bool passwordsMatch = (strcmp(*hashedPassword, *inputPassword) == 0);

//         args.GetReturnValue().Set(passwordsMatch);
//     }

//     void Init(Local<Object> exports, Local<Object> module) {
//         NODE_SET_METHOD(module, "exports", HashPassword);
//         NODE_SET_METHOD(module, "verifyPassword", VerifyPassword);
//     }

//     NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

// }  // namespace
