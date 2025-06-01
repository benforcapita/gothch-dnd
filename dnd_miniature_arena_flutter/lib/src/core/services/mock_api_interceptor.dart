import 'package:dio/dio.dart';

class MockApiInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    print('--> ${options.method} ${options.path}'); // Log request
    print('Headers: ${options.headers}');
    print('Data: ${options.data}');

    if (options.path == '/auth/login' && options.method == 'POST') {
      final email = options.data['email'] as String?;
      if (email == null || email.isEmpty) {
        handler.reject(DioException(
          requestOptions: options,
          response: Response(
            requestOptions: options,
            statusCode: 400,
            data: {'message': 'Email cannot be empty'},
          ),
        ));
        return;
      }
      handler.resolve(Response(
        requestOptions: options,
        statusCode: 200,
        data: {
          'token': 'mock_jwt_token_from_api_for_${email}',
          'user': {'id': 'apiUser_${email.hashCode}', 'username': email.split('@').first, 'email': email}
        },
      ));
      return;
    }

    if (options.path == '/users/me' && options.method == 'GET') {
      final authHeader = options.headers['Authorization'] as String?;
      if (authHeader != null && authHeader.startsWith('Bearer mock_jwt_token_from_api_for_')) {
        // Extract email from token for mock purposes
        final tokenParts = authHeader.split('Bearer mock_jwt_token_from_api_for_');
        final email = tokenParts.length > 1 ? tokenParts[1] : 'test@example.com';

        handler.resolve(Response(
          requestOptions: options,
          statusCode: 200,
          data: {'id': 'apiUser_${email.hashCode}', 'username': email.split('@').first, 'email': email},
        ));
        return;
      } else {
         handler.reject(DioException(
          requestOptions: options,
          response: Response(
            requestOptions: options,
            statusCode: 401,
            data: {'message': 'Unauthorized: Invalid or missing token'},
          ),
        ));
         return;
      }
    }

    // Fallback for unmocked paths - reject with a 404
    handler.reject(
      DioException(
        requestOptions: options,
        response: Response(
          requestOptions: options,
          statusCode: 404,
          data: {'message': 'Endpoint not found in mock server'},
        ),
      ),
    );
    // super.onRequest(options, handler); // Don't call super if we are handling all cases or rejecting
  }
}
