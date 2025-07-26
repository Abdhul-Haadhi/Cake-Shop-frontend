import { Component, OnInit } from '@angular/core';
import { ProductRegistrationFormService } from '../services/product-registration/product-registration-form.service';
import { MessageServiceService } from '../services/message-service/message-service.service';

@Component({
  selector: 'app-front-page',
  standalone: false,
  templateUrl: './front-page.component.html',
  styleUrl: './front-page.component.scss',
})
export class FrontPageComponent implements OnInit {
  featuredCakes: any[] = [
    // {
    //   name: 'Elegant Wedding Cake',
    //   description:
    //     'Multi-tiered masterpiece with delicate sugar flowers and smooth buttercream finish.',
    //   price: '$299',
    //   image:
    //     'https://images.pexels.com/photos/1702373/pexels-photo-1702373.jpeg?auto=compress&cs=tinysrgb&w=400',
    // },
    // {
    //   name: 'Birthday Celebration',
    //   description:
    //     'Colorful and fun designs perfect for making birthday wishes come true.',
    //   price: '$89',
    //   image:
    //     'https://images.pexels.com/photos/1702373/pexels-photo-1702373.jpeg?auto=compress&cs=tinysrgb&w=400',
    // },
    // {
    //   name: 'Chocolate Decadence',
    //   description:
    //     'Rich chocolate layers with premium cocoa and silky ganache.',
    //   price: '$129',
    //   image:
    //     'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400',
    // },
  ];

  services = [
    {
      icon: '🎂',
      title: 'Custom Cakes',
      description:
        'Personalized designs tailored to your special occasion and preferences.',
    },
    {
      icon: '💒',
      title: 'Wedding Cakes',
      description:
        'Elegant multi-tier creations that make your wedding day unforgettable.',
    },
    {
      icon: '🧁',
      title: 'Cupcakes & Treats',
      description:
        'Individual delights perfect for parties, events, or everyday indulgence.',
    },
    {
      icon: '🍰',
      title: 'Dessert Catering',
      description:
        'Complete dessert solutions for corporate events and large celebrations.',
    },
  ];
  products: any[] = [];
  constructor(
    private productService: ProductRegistrationFormService,
    private messageService: MessageServiceService
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  public getProducts() {
    try {
      this.products = [];
      this.productService.getAllProducts().subscribe((response) => {
        response.forEach((element: any) => {
          element.image = 'data:image/jpge;base64,' + element.image;
          this.products.push(element);
        });

        this.processProducts();
      });
    } catch (error) {
      this.messageService.showError('Product loading failed' + error);
    }
  }

  public processProducts(): void {
    this.products.forEach((prod: any) => {
      const obj = {
        name: prod.product,
        description: prod.description,
        price: 'RS ' + prod.finalPrice,
        image: prod.image,
      };

      this.featuredCakes.push(obj);
    });
  }
}
