import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { userApi } from "@/services/api";
import { IUser } from "@/types/user";

interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      console.log("Checking authentication..."); // Debugging line
      try {
        const response = await userApi.getCurrentUser();
        if (response.status === "error") {
          throw new Error(response.error);
        }
        setUser(response.data);
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      try {
        const response = await userApi.login(email, password);
        if (response.status === "error") {
          throw new Error(response.error);
        }

      } catch (error) {
        console.error("Login failed:", error);
        toast({
          title: "Login failed",
          description:
            error instanceof Error
              ? error.message
              : "Please check your credentials and try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, toast]
  );

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      setIsLoading(true);
      try {
        const response = await userApi.signup(name, email, password);
        if (response.status === "error") {
          throw new Error(response.error);
        }

        navigate("/dashboard");
      } catch (error) {
        console.error("Signup failed:", error);
        toast({
          title: "Signup failed",
          description:
            error instanceof Error
              ? error.message
              : "Please try again with different information.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, toast]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("isLoggedIn");
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate("/");
  }, [navigate, toast]);

  const contextValue = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      logout,
    }),
    [user, isLoading, login, signup, logout]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  console.log("Auth context:", context); // Debugging line
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
