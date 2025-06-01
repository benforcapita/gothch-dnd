import 'package:dio/dio.dart';
import 'mock_api_interceptor.dart'; // Adjust path if necessary, should be correct

final dioClient = Dio(BaseOptions(
  baseUrl: 'https://mockapi.example.com/v1', // Using a mock base URL
  connectTimeout: const Duration(seconds: 5),
  receiveTimeout: const Duration(seconds: 3),
))
  ..interceptors.add(MockApiInterceptor());

// Example of how to provide it via Riverpod (optional for now, but good practice)
// final dioProvider = Provider<Dio>((ref) {
//   final dio = Dio(BaseOptions(baseUrl: 'https://mockapi.example.com/v1'));
//   dio.interceptors.add(MockApiInterceptor());
//   // Potentially add more interceptors: logging, error handling, auth token injection from secure storage
//   return dio;
// });
