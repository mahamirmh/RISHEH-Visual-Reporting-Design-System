import {test,expect} from "@playwright/test";
import {mkdirSync} from "node:fs";
test("renders Persian report with accessible chart data on desktop and mobile",async({page})=>{
 await page.goto("/");
 await expect(page.locator("article")).toHaveAttribute("dir","rtl");
 await expect(page.getByRole("heading",{level:1})).toContainText("گزارش");
 await expect(page.getByText("داده‌های این گزارش صرفاً نمایشی هستند.")).toBeVisible();
 await page.getByText("View chart data").click();
 await expect(page.getByRole("table").last()).toBeVisible();
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2);
 expect(overflow).toBe(false);
 mkdirSync("test-results",{recursive:true});
 await page.screenshot({path:"test-results/report-"+test.info().project.name+".png",fullPage:true});
});
