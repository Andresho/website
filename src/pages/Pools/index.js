import React from "react";
import { Switch, Route } from "react-router-dom";
import ListPools from "./ListPools.js";
import CreatePool from "./CreatePool.js";
import Pool from "./PoolRouter.js";
import "./ManagePools.css";
import ScrollToTop from "../../components/ScrollToTop";
import NotFound from "../NotFound/NotFound";

const ManagePoolRoute = () => {
  return (
    <ScrollToTop>
      <Switch>
        <Route exact path="/manage-pools" component={ListPools} />
        <Route path="/manage-pools/create-pool" component={CreatePool} />
        <Route path="/manage-pools/pool/:poolId?" component={Pool} />
        <Route path="*" component={NotFound} />
      </Switch>
    </ScrollToTop>
  );
};

export default ManagePoolRoute;
