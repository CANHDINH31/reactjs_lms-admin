import { Switch, Route } from "react-router-dom";
import { arrayRoutes } from "../helper/configs";

export const getRoutes = () => {
  return (
    <Switch>
      {arrayRoutes.map((e, index) => (
        <Route key={index} path={e.path}>
          {e.component}
        </Route>
      ))}
    </Switch>
  );
};
