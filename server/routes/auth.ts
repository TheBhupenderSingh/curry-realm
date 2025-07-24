import { RequestHandler } from "express";

// Mock user database - in production this would be a real database
const users = {
  "admin@taskflow.com": {
    password: "admin123",
    role: "Admin",
    name: "System Administrator",
    email: "admin@taskflow.com",
    permissions: ["all"],
    department: "Administration",
    status: "Active",
  },
  "john.smith@company.com": {
    password: "ho123",
    role: "HO",
    name: "John Smith",
    email: "john.smith@company.com",
    permissions: ["manage_tasks", "assign_tasks", "view_reports"],
    department: "Management",
    status: "Active",
  },
  "sarah.johnson@company.com": {
    password: "fo123",
    role: "FO",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    permissions: ["view_tasks", "update_tasks"],
    department: "IT Operations",
    status: "Active",
  },
  "mike.wilson@company.com": {
    password: "fo123",
    role: "FO",
    name: "Mike Wilson",
    email: "mike.wilson@company.com",
    permissions: ["view_tasks", "update_tasks"],
    department: "Security",
    status: "Active",
  },
};

interface LoginRequest {
  email: string;
  password: string;
  role?: string;
}

interface LoginResponse {
  success: boolean;
  message?: string;
  user?: {
    name: string;
    email: string;
    role: string;
    permissions: string[];
    department: string;
    status: string;
  };
  token?: string;
}

export const handleLogin: RequestHandler = (req, res) => {
  try {
    const { email, password, role }: LoginRequest = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Check if user exists
    const user = users[email as keyof typeof users];
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Please check your email address.",
      });
    }

    // Check if user account is active
    if (user.status !== "Active") {
      return res.status(401).json({
        success: false,
        message: "Account is inactive. Please contact administrator.",
      });
    }

    // Verify password
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid password. Please try again.",
      });
    }

    // Verify role if specified
    if (role && user.role !== role) {
      return res.status(401).json({
        success: false,
        message: "Invalid role selected for this user.",
      });
    }

    // Generate a mock JWT token (in production, use proper JWT)
    const token = `mock_jwt_token_${Date.now()}_${user.role}`;

    // Return success response with user data
    const response: LoginResponse = {
      success: true,
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        department: user.department,
        status: user.status,
      },
      token,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

export const handleLogout: RequestHandler = (req, res) => {
  try {
    // In production, you would invalidate the JWT token here
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const handleVerifyToken: RequestHandler = (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // Mock token verification (in production, verify JWT properly)
    if (!token.startsWith("mock_jwt_token_")) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    // Extract role from mock token
    const tokenParts = token.split("_");
    const role = tokenParts[tokenParts.length - 1];

    res.status(200).json({
      success: true,
      message: "Token is valid",
      role,
    });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
