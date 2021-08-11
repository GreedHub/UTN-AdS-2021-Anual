import { Redirect, Route, RouteProps } from 'react-router';

export type ProtectedRouteProps = {
  authenticationPath: string;
} & RouteProps;

export default function PrivateRoute({authenticationPath, ...routeProps}: ProtectedRouteProps) {
  if(isAuthenticated()) {
    return <Route {...routeProps} />;
  } else {
    return <Redirect to={{ pathname: authenticationPath }} />;
  }
};

function isAuthenticated(){
  return sessionStorage.getItem('AUTH_ACCESS_TOKEN') 
    && sessionStorage.getItem('AUTH_REFRESH_TOKEN');
}