import generateToken from "./generateTokenUtils.js";
import setTokenCookie from "./setTokenCookies.js";

const shouldReturnAccessToken = (req) => {
  const clientType =
    req.headers["x-client-type"] ||
    req.body?.clientType ||
    req.query?.clientType;

  return clientType === "mobile";
};

const buildUserPayload = (user) => ({
  id: user._id,
  slug: user.slug,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  avatar: user.avatar || null,
  phone: user.phone || "",
  location: user.location || "",
  bio: user.bio || "",
  dob: user.dob || "",
  sex: user.sex || "",
  provider: user.provider,
});

export const sendAuthResponse = ({
  req,
  res,
  user,
  statusCode = 200,
  message = "Authenticated successfully",
}) => {
  const token = generateToken(user._id, { provider: user.provider });

  // keep existing web behavior
  setTokenCookie(res, token);

  const payload = {
    message,
    user: buildUserPayload(user),
  };

  // mobile can use this
  if (shouldReturnAccessToken(req)) {
    payload.accessToken = token;
    payload.tokenType = "Bearer";
    payload.expiresIn = "30d";
  }

  return res.status(statusCode).json(payload);
};