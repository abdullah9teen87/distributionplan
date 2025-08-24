// lib/apiResponse.js

// ✅ Success Response
export function successResponse(data, message = "Success", status = 200) {
  return new Response(
    JSON.stringify({ success: true, message, data }),
    {
      status,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// ✅ Created Response (201)
export function createdResponse(data, message = "Created") {
  return successResponse(data, message, 201);
}

// ✅ Error Response
export function errorResponse(error, status = 400) {
  return new Response(
    JSON.stringify({
      success: false,
      message: error?.message || "Something went wrong",
    }),
    {
      status,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// ✅ Not Found
export function notFoundResponse(message = "Not found") {
  return new Response(
    JSON.stringify({ success: false, message }),
    {
      status: 404,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// ✅ Conflict
export function conflictResponse(message = "Conflict detected") {
  return new Response(
    JSON.stringify({ success: false, message }),
    {
      status: 409,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// ✅ Method Not Allowed
export function methodNotAllowedResponse(message = "Method not allowed") {
  return new Response(
    JSON.stringify({ success: false, message }),
    {
      status: 405,
      headers: { "Content-Type": "application/json" },
    }
  );
}
