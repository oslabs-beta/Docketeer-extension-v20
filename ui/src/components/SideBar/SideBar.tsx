import React from 'react';
import styles from './SideBar.module.scss';
import { NavLink } from 'react-router-dom';

interface SideBarProps {
  isOpen: boolean,
  prune: (e: React.MouseEvent) => void;
}

const SideBar = ({ isOpen, prune }: SideBarProps): React.JSX.Element => {
  const sidebarClassName = isOpen
    ? `${styles.SideBar} ${styles['sidebar-open']}`
    : `${styles.SideBar} ${styles['sidebar-closed']}`;

  return (
    <div
      style={{ width: isOpen ? '200px' : '0px' }}
      className={sidebarClassName}
      data-testid='sidebar'
    >
      <div>
        <NavLink
          className={({ isActive }) =>
            isActive ? styles.active : styles.navButton
          }
          to="/metrics"
        >
          CONTAINER METRICS
        </NavLink>
      </div>
      <div>
        <NavLink
          className={({ isActive }) =>
            isActive ? styles.active : styles.navButton
          }
          to="/snapshots"
        >
          SNAPSHOTS
        </NavLink>
      </div>
      <div>
        <NavLink
          className={({ isActive }) =>
            isActive ? styles.active : styles.navButton
          }
          to="/K8Metrics"
        >
          KUBERNETES METRICS
        </NavLink>
      </div>
      <div>
        <NavLink
          className={({ isActive }) =>
            isActive ? styles.active : styles.navButton
          }
          to="/volume"
        >
          VOLUMES
        </NavLink>
      </div>
      <div>
        <NavLink
          className={({ isActive }) =>
            isActive ? styles.active : styles.navButton
          }
          to="/logs"
        >
          PROCESS LOGS
        </NavLink>
      </div>
      <div>
        <NavLink
          className={({ isActive }) =>
            isActive ? styles.active : styles.navButton
          }
          to="/configuration"
        >
          CONFIGURATIONS
        </NavLink>
      </div>
      <div>
        <a className={styles.navButton} onClick={(e) => prune(e)}>
          PRUNE
        </a>
      </div>
    </div>
  );
};

export default SideBar;
