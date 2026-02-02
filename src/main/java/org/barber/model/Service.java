package org.barber.model;

public class Service {
    private String name;
    private double price;
    private String time;

    public Service(String name, double price, String time) {
        this.name = name;
        this.price = price;

        this.time = time;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }
}
