/** @format */

import type { ReactNode } from "react";
import { createElement } from "react";
import {
  GridFilledIcon,
  GraduationFilledIcon,
  DocumentFilledIcon,
  WalletFilledIcon,
  SettingsFilledIcon,
} from "@/shared/ui";
import { paths } from "@/shared/config/routes";

export interface Destination {
  label: string;
  /** Fits the 80dp rail, where the full label would wrap over three lines. */
  short: string;
  to: string;
  icon: (size?: number) => ReactNode;
}

/** Shared by the collapsed rail and the expanded drawer, so both stay in sync. */
export const destinations: Destination[] = [
  // {
  //   label: 'Bosh sahifa',
  //   short: 'Bosh',
  //   to: paths.dashboard,
  //   icon: (size) => createElement(HomeFilledIcon, { size }),
  // },
  {
    label: "Barcha kurslar",
    short: "Kurslar",
    to: paths.courses,
    icon: (size) => createElement(GridFilledIcon, { size }),
  },
  {
    label: "Mening o'qishim",
    short: "O'qishim",
    to: paths.learning,
    icon: (size) => createElement(GraduationFilledIcon, { size }),
  },
  {
    label: "Mening arizalarim",
    short: "Arizalar",
    to: paths.applications,
    icon: (size) => createElement(DocumentFilledIcon, { size }),
  },
  {
    label: "To'lovlar",
    short: "To'lovlar",
    to: paths.payments,
    icon: (size) => createElement(WalletFilledIcon, { size }),
  },
  {
    label: "Sozlamalar",
    short: "Sozlama",
    to: paths.settings,
    icon: (size) => createElement(SettingsFilledIcon, { size }),
  },
];
