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
// export function errorResponse(error, status = 400) {
//   return new Response(
//     JSON.stringify({
//       success: false,
//       message: error?.message || "Something went wrong",
//     }),
//     {
//       status,
//       headers: { "Content-Type": "application/json" },
//     }
//   );
// }

export function errorResponse(error, status = 400) {
  const msg =
    typeof error === "string"
      ? error
      : error?.message || "Something went wrong";

  return new Response(
    JSON.stringify({
      success: false,
      message: msg,
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

export function unauthorizedResponse(message = "Unauthorized") {
  return new Response(
    JSON.stringify({ success: false, message }),
    {
      status: 401,
      headers: { "Content-Type": "application/json" },
    }
  );
}

export function forbiddenResponse(message = "Forbidden") {
  return new Response(
    JSON.stringify({ success: false, message }),
    {
      status: 403,
      headers: { "Content-Type": "application/json" },
    }
  );
}

export function validationErrorResponse(message = "Validation error") {
  return new Response(
    JSON.stringify({ success: false, message }),
    {
      status: 422,
      headers: { "Content-Type": "application/json" },
    }
  );
}


export function serverErrorResponse(message = "Internal server error") {
  return new Response(
    JSON.stringify({ success: false, message }),
    {
      status: 500,
      headers: { "Content-Type": "application/json" },
    }
  );
}
