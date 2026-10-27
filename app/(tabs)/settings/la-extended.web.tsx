import NotAvailableScreen from "@/components/NotAvailable";
import { title } from "@/utils/TitleFunction";
import { useHeaderTitleOnFocus } from "@/utils/UseHeaderTitleOnFocus";
import { useTranslation } from "react-i18next";

export default function LaExtendedScreen() {
  const { t } = useTranslation();
  const pageTitle = title(t("settings.laExtended.title"));
  useHeaderTitleOnFocus(pageTitle);

  return NotAvailableScreen()
}