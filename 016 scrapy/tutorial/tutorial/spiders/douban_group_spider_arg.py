import scrapy

'''
scrapy crawl DBGroupArg -o shanghai.xml -a group=558292
'''

class DoubanGroupSpider(scrapy.Spider):
    name = "DBGroupArg"

    def start_requests(self):
        urls = [
            'https://www.douban.com/group/%s/discussion?start=0' % self.group,
        ]
        for url in urls:
            yield scrapy.Request(
                url=url, 
                callback=self.parse, 
                headers={
                    "Host": "www.douban.com",
                    "Connection": "keep-alive",
                    "Pragma": "no-cache",
                    "Cache-Control": "no-cache",
                    "Upgrade-Insecure-Requests": "1",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Accept-Language": "zh-CN,zh;q=0.8,en;q=0.6",
                    "Cookie": "bid=RLMIjL-JawY; ps=y; ap=1; ct=y; push_noty_num=0; push_doumail_num=0; _pk_ref.100001.8cb4=%5B%22%22%2C%22%22%2C1502110071%2C%22https%3A%2F%2Fwww.baidu.com%2Flink%3Furl%3Dy7gt9gU5EPJAXCTkTG-M6RSYIPeOCCsrwwjkJKCUgbecsLC60PoYayvZWaY3aZgioIpU208D9tPMpCSViQm5Ja%26wd%3D%26eqid%3D893d05690002357a0000000459886150%22%5D; _pk_id.100001.8cb4=bc57e396c910ab8d.1501396277.4.1502110237.1501511199.; _pk_ses.100001.8cb4=*; __utma=30149280.1999551137.1501396277.1501510334.1502110072.4; __utmb=30149280.24.5.1502110238123; __utmc=30149280; __utmz=30149280.1502110072.4.4.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; __utmv=30149280.11931; __yadk_uid=jIhNVXdNXUmTJTiZsJr58yc98TNCGaIQ",
                }
            )

    def parse(self, response):

        yield {'title': response.xpath('//title/text()').extract_first()}

        for tr in response.css("table.olt tr"):
            if tr.css('td') == []:
                pass
            elif tr.css('a::attr(title)').extract_first() is None:
                pass
            elif  tr.css('td')[1].css('a::text').extract_first() is None:
                pass
            else:
                yield {
                    'title': tr.css('a::attr(title)').extract_first(),
                    'author':  tr.css('td')[1].css('a::text').extract_first(),
                }