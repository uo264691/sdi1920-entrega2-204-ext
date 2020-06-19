package com.uniovi.tests.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PO_SearchUserNode extends PO_NavView{
	static public void fillForm(WebDriver driver, String busqueda) {
		WebElement dni = driver.findElement(By.name("busqueda"));
		dni.click();
		dni.clear();
		dni.sendKeys(busqueda);
		
		// Pulsar el boton de Alta.
		By boton = By.className("btn");
		driver.findElement(boton).click();
	}
}
