import React, { useEffect, useState } from "react";
import "./ManagePools.css";
import HeroSection from "../../components/HeroSection";
import { homeObjOne } from "../NotFound/Data.js";
import { API, graphqlOperation } from "aws-amplify";
import ChangeAppearance from "./manage/ManageVisual";
import ChangeBackEnd from "./manage/ManageBackEnd";
import { Button } from "../../components/Button";
import { Switch, Route, Link } from "react-router-dom";
import ScrollToTop from "../../components/ScrollToTop";
import NotFound from "../NotFound/NotFound";

import Test from "./manage/test";

const getPool = /* GraphQL */ `
  query GetPool($id: ID!) {
    getPool(id: $id) {
      id
      title
      description
      tnc
      image {
        bucket
        region
        key
      }
      requiredtrust
      status
      catagoryID
      catagory {
        id
        title
        catagory
        xtypeID
        xtype {
          data
        }
        ytypeID
        ytype {
          data
        }
        status
      }
      createdAt
      updatedAt
      privateKey
    }
  }
`;

const ModifyPool = ({ match }) => {
  const [fetch, setFetch] = useState(false);
  const [result, setResult] = useState([]);

  useEffect(() => {
    const id = match.params.poolId;
    API.graphql(graphqlOperation(getPool, { id: id }))

      .then((val) => {
        if (val.data.getPool !== null) {
          setResult(val.data.getPool);
          setFetch(true);
        } else {
          setFetch(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setFetch(false);
      });
  }, [match]);

  if (result === [] && fetch === true) {
    return <></>;
  } else if (fetch === false) {
    return <HeroSection {...homeObjOne} />;
  }

  console.log("match url: ", match);
  return (
    <div className="pool-page-container">
      <div className="pool-side-nav">
        <ul className="pool-side-nav-list">
          <li>
            <Link to={`${match.url}/appearance`}>Appearance</Link>
          </li>
          <li>
            <Link to={`${match.url}/backend`}>Back end</Link>
          </li>
          <li>
            <Link to={`${match.url}/statistics`}>Statistics</Link>
          </li>
          <li>
            <Link to={`${match.url}/billing`}>Billing</Link>
          </li>
          <li>
            <Link to={`${match.url}/export-data`}>Export Data</Link>
          </li>
        </ul>
        <Button type="submit" buttonSize="btn--mobile" Glow="orange">
          Publish
        </Button>
      </div>

      <ScrollToTop>
        <Switch>
          <Route
            exact
            path={`${match.url}/appearance`}
            component={() => <ChangeAppearance result={result} />}
          />
          <Route
            exact
            path={`${match.url}/backend`}
            component={() => <ChangeBackEnd result={result} />}
          />
          <Route
            exact
            path={`${match.url}/statistics`}
            component={() => <ChangeBackEnd result={result} />}
          />
          <Route
            exact
            path={`${match.url}/billing`}
            component={() => <ChangeBackEnd result={result} />}
          />
          <Route
            exact
            path={`${match.url}/export-data`}
            component={() => <ChangeBackEnd result={result} />}
          />
          <Route
            exact
            path={`${match.url}/test`}
            component={() => <Test result={result} />}
          />
          <Route path="*" component={NotFound} />
        </Switch>
      </ScrollToTop>
    </div>
  );
};

export default ModifyPool;

//flex wrap
//flex wrap wrap
//this.props.match.params.email
