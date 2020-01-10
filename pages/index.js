import { useState } from 'react';
import Head from 'next/head';
import { Container, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import classnames from 'classnames';

import SplitEvenly from '../components/containers/SplitEvenly';
import SplitIndividually from '../components/containers/SplitIndividually';

import 'bootstrap/dist/css/bootstrap.min.css';

import '../static/css/styles.css';

const SPLIT_TYPES = {
  EVENLY: 'evenly',
  INDIVIDUALLY: 'individually'
};

const IndexPage = ({ lastActiveTab }) => {
  const [activeTab, setActiveTab] = useState(lastActiveTab);
  const toggle = (type) => setActiveTab(type);

  return (
    <React.Fragment>
      <Head>
        <link href="https://fonts.googleapis.com/css?family=Poppins&display=swap" rel="stylesheet" />
      </Head>

      <Container>
        <Nav tabs className="mb-3">
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === SPLIT_TYPES.EVENLY })}
              onClick={() => { toggle(SPLIT_TYPES.EVENLY); }}
            >
              Split Evenly
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === SPLIT_TYPES.INDIVIDUALLY })}
              onClick={() => { toggle(SPLIT_TYPES.INDIVIDUALLY); }}
            >
              Split Individually
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={activeTab}>
          <TabPane tabId={SPLIT_TYPES.EVENLY}>
            <SplitEvenly />
          </TabPane>
          <TabPane tabId={SPLIT_TYPES.INDIVIDUALLY}>
            <SplitIndividually />
          </TabPane>
        </TabContent>
      </Container>
    </React.Fragment>
  );
};

IndexPage.getInitialProps = () => {
  return {
    lastActiveTab: SPLIT_TYPES.INDIVIDUALLY
  }
};

export default IndexPage;
