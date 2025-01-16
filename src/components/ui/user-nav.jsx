import { Link, useNavigate } from "react-router-dom";
import { LayoutGrid, LogOut, User } from "lucide-react";

import { Button } from "./button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "src/@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "src/@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "src/@/components/ui/dropdown-menu";
import { setUserLogout } from "state/actions/UserAction";
import { useSelector } from "react-redux";

export function UserNav() {
  const employee = useSelector((state) => state.emp.user_details);
  const navigate = useNavigate();
  const handleLogout = () => {
    window.localStorage.setItem("token", "");
    setUserLogout();
    navigate("/login");
  };

  // const fetchData = async () => {
  //   const employeeResponse = await axios.get(
  //     `${baseUrl}/emp/${userProfile.id}`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   );
  //   const employeeData = employeeResponse.data;
  //   setEmployee(employeeData);
  //   // setNavigation(getNavigation(employeeData.user_role));
  //   setProfileImage(employeeResponse.data?.profile_picture);
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  const combineFLName =
    employee?.first_name?.charAt(0).toUpperCase() +
    employee?.last_name?.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="relative w-10 h-10 rounded-full"
              >
                <Avatar className="">
                  <AvatarImage src={employee?.profile_picture} alt="Avatar" />
                  <AvatarFallback className="bg-transparent">
                    {combineFLName}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">Profile</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent className="w-56 " align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {`${employee?.first_name} ${employee?.last_name}`}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {employee?.work_email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <Link to="/" className="flex items-center">
              <LayoutGrid className="w-4 h-4 mr-3 text-muted-foreground" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <Link to="/my-profile" className="flex items-center">
              <User className="w-4 h-4 mr-3 text-muted-foreground" />
              Account
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="hover:cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-3 text-muted-foreground" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserNav;
