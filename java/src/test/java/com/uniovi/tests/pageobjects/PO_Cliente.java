package com.uniovi.tests.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PO_Cliente extends PO_NavView {
	static public void login(WebDriver driver, String email, String password) {
		WebElement dni = driver.findElement(By.name("email"));
		dni.click();
		dni.clear();
		dni.sendKeys(email);
		
		WebElement passwordField = driver.findElement(By.name("password"));
		passwordField.click();
		passwordField.clear();
		passwordField.sendKeys(password);
		
		// Pulsar el boton de aceptar.
		By boton = By.className("btn");
		driver.findElement(boton).click();
	}
	
	static public void filterFriend(WebDriver driver, String name) {
		WebElement dni = driver.findElement(By.id("filtroNombre"));
		dni.click();
		dni.clear();
		dni.sendKeys(name);
	}

	public static void openFriendChat(WebDriver driver, String name) {
		WebElement friend = driver.findElement(By.xpath("//a[contains(text(),'" + name + "')]"));
		friend.click();
	}

	public static void sendMessage(WebDriver driver, String message) {
		WebElement textArea = PO_View.checkElement(driver, "id", "areaMensaje").get(0);
		textArea.click();
		textArea.clear();
		textArea.sendKeys(message);
		
		// Pulsar el boton de enviar.
		By boton = By.className("btn");
		driver.findElement(boton).click();
	}
}
