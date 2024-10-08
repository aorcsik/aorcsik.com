---
title: Mystery of the Power-Saving Outlets
description: My UPS was turning on and off for no reason. It turned out to be a feature.
# image: https://static.aorcsik.com/blog/apc-power-saving-es-8-outlet-550va.webp
author: aorcsik
published_at: 2023.07.26
---

A few weeks ago, I noticed something strange around my desk. The LED indicator on the MacBook Pro charger was off. Also, a smart outlet was frequently offline, which resulted in the connected light going out and on randomly (spooky). I checked, and both of them were plugged in. They were supposed to get power from the lower row of power outlets on my UPS Back-Ups ES 550VA, the surge-protect-only outlets. They were all dead. No reason… it must be broken, again… or at least I thought it was at the time.

I have had this UPS (uninterruptible power supply) since 2011. I like it because it has traditional power outlets that can be used with any regular electronic device. There are two rows of outlets, the upper one battery-powered and the lower one surge-protected. It can protect ethernet, too, but only 10/100, which is a little outdated for today's gigabit networks.

![image](https://static.aorcsik.com/blog/apc-power-saving-es-8-outlet-550va.webp "APC Back-Ups ES 550VA")

It worked flawlessly for nine years, but by 2020, the battery degraded so much that the unit started to warn me about it. I had this for a reason, so leaving it broken was impossible. After some research, I managed to buy a replacement battery (APC RBC110). Interestingly, the battery cost a little more in 2020 than the entire unit in 2011, and today, the exact battery costs almost twice that price… that's inflation for you. Anyway. The new battery was a perfect fit, and the UPS was working again… until recently.

I had no idea what had gone wrong, so I moved almost everything from those outlets for safety, leaving only the smart outlet in the rightmost place for a light we rarely use—solved… well, not really. What kind of solution is this? I don't know what was wrong, and I'm not using half of the unit. On top of all this, I kept hearing a clicking sound now and then when the power was going in and out of the UPS outlets. Damn, I was pissed. I even started searching for a new UPS.

Then, today, I decided to install a desk lamp, and there were just no available outlets left. I had to use the ones on the UPS. Huh… ok then. I plugged it in. Works. A few minutes later, it went off, and then it came back on after a few minutes. Now I was pissed. I climbed under the desk and started looking at the unit. If I stare very sternly at it, it will begin to behave, which was when I noticed. Two green lights were on, the primary power indicator and another, above the button, with the leaf on it. I never cared about that button. I thought it was some fancy economy mode, which is only suitable for marketing – sorry, economy. Well, I was so wrong…

I pressed the button long, one beep, and the green light was off. All the outlets were on, and they stayed like that. What the hell? What is the meaning of this? What does that bloody button do? So I searched the internet and RTFM. Here is the relevant part:

> **Power-saving Master and Controlled Outlets**  
> To conserve electricity, configure the Back-UPS to recognize a Master device, such as a desktop computer or an A/V receiver, and Controlled peripheral devices, such as a printer, speakers, or scanner. When the Master device goes into Sleep or Standby mode or turns off, the Controlled device(s) will also shut down, saving electricity.


So, it wasn't just marketing. I must have accidentally enabled this feature, and whenever my desktop computer went to sleep, the controlled outlets turned off. I must say, this is a very clever thing for a UPS. Unfortunately, I have stuff plugged in there that I need on, even if the computer is asleep. So the Power-saving mode stays off – again, sorry, economy – and the riddle is finally solved.

PS.: While looking for a good cover photo, I noticed that only the first three outlets in the lower row are controlled by the power-saving feature, so the smart outlet on the right has been working all the time since I moved it there.
