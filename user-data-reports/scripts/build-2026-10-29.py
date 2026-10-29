from pathlib import Path
import json,re,datetime,math,hashlib
root=Path(__file__).resolve().parents[1]
w=json.loads((root/'evidence/weekly.json').read_text())['results']
ret=json.loads((root/'evidence/retention.json').read_text())['results'];curve=json.loads((root/'evidence/curve.json').read_text())['results']
assert [r[2] for r in w[:10]]==[266,178,186,391,202,489,375,715,591,305]
assert [r[1] for r in w[:10]]==[546,521,734,1185,613,2112,1304,1562,2356,1237]
assert sum(r[2] for r in ret[:6])==140 and sum(r[1] for r in ret[:6])==1712
rates=[100*a/v for _,v,a in w]
def quant(p):
 s=sorted(rates);i=(len(s)-1)*p;return s[int(i)]+(s[min(int(i)+1,len(s)-1)]-s[int(i)])*(i-int(i))
qs=[quant(p) for p in [0,.25,.5,.75,1]];goal=int(qs[3]+.5)
def label(d):
 a=datetime.date.fromisoformat(d);b=a+datetime.timedelta(days=6);return f'{a.month}/{a.day:02}~{b.month}/{b.day:02}'
def table(headers,rows,two=False):
 return '<div class="table-scroll'+(' compact-two' if two else '')+'" role="region" tabindex="0" aria-label="'+headers[0]+'"><table class="numeric"><thead><tr>'+''.join(f'<th scope="col">{h}</th>' for h in headers)+'</tr></thead><tbody>'+''.join('<tr'+(' class="latest"' if i>=len(rows)-2 else '')+'>'+''.join(f'<td>{c}</td>' for c in row)+'</tr>' for i,row in enumerate(rows))+'</tbody></table></div>'
def chart(labels,vals,title,maxval,suffix='',width=1440):
 xs=[75+i*(width-150)/(len(vals)-1) for i in range(len(vals))];ys=[222-v/maxval*184 for v in vals]
 s=f'<figure class="updated-chart"><div class="chart-scroll" role="region" tabindex="0" aria-label="{title}"><svg style="width:{width}px;max-width:none" viewBox="0 0 {width} 290" role="img" aria-label="{title}"><title>{title}</title>'
 for v in range(5):
  y=222-v*46;s+=f'<line x1="75" y1="{y}" x2="{width-75}" y2="{y}"/><text x="62" y="{y+5}" text-anchor="end">{maxval*v/4:g}{suffix}</text>'
 s+='<polyline fill="none" points="'+' '.join(f'{x},{y}' for x,y in zip(xs,ys))+'"/>'
 for x,y,v,l in zip(xs,ys,vals,labels):
  v=f'{v:.2f}' if suffix else str(v);s+=f'<circle cx="{x}" cy="{y}" r="4"/><text x="{x}" y="{y-12}" text-anchor="middle" font-weight="600">{v}{suffix}</text><text x="{x}" y="260" text-anchor="middle">{l}</text>'
 return s+f'</svg></div><figcaption class="note">{title}</figcaption></figure>'
s=(root/'template.html').read_text();parts=re.split(r'(<section[^>]*>.*?</section>)',s,flags=re.S);sections=[x for x in parts if x.startswith('<section')]
# preserve GA images and explanation exactly
old=sections[2];ga=old[old.index('<h3>일별 사용 패턴'):old.index('<h3>Retention')]
labels=[label(x[0]) for x in w]
sections[2]='<section><h2>2. 활성 유저 데이터</h2><h3>WAU</h3><p>WAU는 한 주 동안 <code>offer_link_click</code> 또는 <code>banner_click</code>을 1회 이상 수행한 고유 사용자 수다.</p><div class="formula">WAU = 주간 (offer_link_click OR banner_click) 고유 사용자 수</div>'+chart(labels,[r[2] for r in w],'주별 WAU 추이 (완료 주)',800)+table(['기간','WAU'],[[l,f'{r[2]:,}'] for l,r in zip(labels,w)],True)+'<p>최근 2주의 WAU는 10/12~10/18에 616명, 10/19~10/25에 380명이다.</p>'+ga+'<h3>Retention</h3><p>Retention은 활성 사용자가 이후에도 다시 할인 정보를 선택하는지를 본다.</p>'+chart([f'W+{r[0]}' for r in curve],[r[2]/r[1]*100 for r in curve],'8/03~9/27의 여덟 주간 코호트를 합친 재사용률',100,'%',650)+'<p>점 5개는 기준 주(W+0)와 1~4주 뒤의 재사용률이다. 같은 여덟 코호트를 합산한 W+4 Retention은 <strong>8.07%</strong>다.</p></section>'
sections[3]='<section><h2>3. WAU와 Week 4 Retention</h2>'+table(['Week 0','활성 사용자','W+4 재활성 사용자','W+4 Retention'],[[label(d),f'{n:,}',str(a),f'{a/n*100:.2f}%'] for d,n,a in ret])+'<p>4주 뒤의 한 주까지 관측이 끝난 8/03~9/27의 여덟 코호트에서 W+4 Retention은 5.59~12.87%다. 코호트별 활성 사용자 2,802명 중 재활성 사용자 226명으로, 합산 비율은 8.07%다.</p></section>'
sections[4]=re.sub(r'<h3>관찰한 것</h3>.*?<h3>현재 판단', '<h3>관찰한 것</h3><p>이전 2주(9/28~10/11)의 활성 사용자는 814명, 최근 2주(10/12~10/25)는 <strong>895명</strong>으로 <strong>81명(10.0%) 증가했다.</strong> 방문자는 이전 2주 3,260명에서 최근 2주 <strong>3,414명</strong>으로 <strong>154명(4.7%) 증가했다.</strong></p><p>여덟 코호트를 합산한 W+4 Retention은 <strong>8.07%</strong>로, 이전 리포트의 여섯 코호트 합산 8.18%와 0.11%p 차이다.</p><p class="note">합산 대상 코호트가 달라 동일 집단의 변화로 해석하지 않는다.</p><h3>현재 판단',sections[4],flags=re.S).replace('W+4 Retention 8.18%','W+4 Retention 8.07%')
sections[6]='<section><h2>6. 핵심 지표 데이터</h2>'+table(['기간','외부 고유 방문자','할인 선택 사용자','할인 선택 도달률'],[[l,f'{v:,}',f'{a:,}',f'{a/v*100:.2f}%'] for l,(_,v,a) in zip(labels,w)])+chart(labels,rates,'주별 할인 선택 도달률 (완료 주)',60,'%')+'</section>'
sections[7]=re.sub(r'<p>이전 2주.*?</p>','<p>이전 2주(9/28~10/11)의 할인 선택 도달률은 <strong>24.97%</strong>, 최근 2주(10/12~10/25)는 <strong>26.22%</strong>로 <strong>1.25%p 높아졌다.</strong> 방문자와 할인 선택 사용자가 모두 늘었고, 선택 사용자의 증가율이 더 컸다.</p>',sections[7],count=1,flags=re.S)
# use unrounded values for differences
assert round(100*895/3414-100*814/3260,2)==1.25
names=['최솟값','25퍼센타일','중앙값','75퍼센타일','최댓값']
dist=table(['기준','할인 선택 도달률'],[[n,f'{v:.2f}%'] for n,v in zip(names,qs)],True)
# SVG distribution uses exact numeric positions; stagger labels to avoid overlap
positions=[75+(v-qs[0])/(qs[-1]-qs[0])*650 for v in qs]
dist+='<div class="distribution centered-block" style="overflow-x:auto"><svg style="width:100%;min-width:650px" viewBox="0 0 800 180" role="img" aria-label="週별 도달률 분포"><line x1="75" y1="85" x2="725" y2="85" stroke="#8198b4"/>'
for i,(x,v,n) in enumerate(zip(positions,qs,names)):
 y=35 if i%2==0 else 140
 dist+=f'<line x1="{x}" y1="{y+8 if y<85 else 85}" x2="{x}" y2="{85 if y<85 else y-20}" stroke="#285da4"/><circle cx="{x}" cy="85" r="4" fill="#285da4"/><text x="{x}" y="{y}" text-anchor="middle" font-size="13">{n}</text><text x="{x}" y="{y+18}" text-anchor="middle" font-size="14">{v:.2f}%</text>'
dist+='</svg></div>'
sections[8]=re.sub(r'8/03~10/11.*?완료된 10개','8/03~10/25)의 완료된 12개',sections[8])
a=sections[8].index('  <div class="table-scroll');b=sections[8].index('  <div class="metric">',a);sections[8]=sections[8][:a]+dist+sections[8][b:]
sections[8]=sections[8].replace('33.87%',f'{qs[3]:.2f}%').replace('34%',f'{goal}%')
sections[8]=sections[8].replace('<h2>8. 핵심 지표 목표</h2>', '<h2>8. 핵심 지표 목표</h2><h3>지난 목표와 달성 결과</h3>'+table(['당시 목표','10/12~10/18','10/19~10/25','최종 판정'],[['두 주 모두 34% 이상','34.72%, 달성','19.36%, 미달','미달']])+'<h3>다음 관측에 적용할 목표: 34%</h3><p>목표를 다시 계산한 결과, 75퍼센타일은 34.30%다. 반올림한 목표는 이전과 같은 <strong>34%</strong>다.</p>')
sections[9]='''<section><h2>현재까지의 관찰</h2><h3>이번 스프린트에서 확인한 것</h3><p>관측 기간: 최근 완료된 2주(10/12~10/25)</p><ul><li>지난 2주의 WAU: 10/12~10/18은 616명, 10/19~10/25는 380명</li><li>주간 할인 선택 도달률은 34.72%, 19.36%다. 당시 목표 34%를 첫째 주는 달성했으나 둘째 주는 미달해 두 주 모두 달성하는 조건은 충족하지 못했다.</li></ul>'''+table(['지표','이전 2주 (9/28~10/11)','최근 2주 (10/12~10/25)','변화'],[['방문자','3,260명','3,414명','154명 증가 (4.7%)'],['활성 사용자','814명','895명','81명 증가 (10.0%)'],['할인 선택 도달률','24.97%','26.22%','1.25%p 상승']])+'''<p>2주간 사용자 수는 각 기간 전체에서 중복 제거했다. W+4 Retention은 여덟 코호트 합산 8.07% (226/2,802)다.</p><h3>아직 판단하기 어려운 것</h3><ul><li>WAU 변동의 원인</li><li>W+4 Retention 약 8%의 적정성</li><li>W+4라는 재방문 주기의 적절성</li></ul><h3>다음에 확인할 것</h3><ul><li>주간 선택 도달률이 34.72%에서 19.36%로 달라진 두 주의 유입 경로와 할인 구성</li><li>다음 스프린트의 주간 할인 선택 도달률과 목표 달성 여부</li></ul></section>'''
i=0
for j,x in enumerate(parts):
 if x.startswith('<section'):parts[j]=sections[i];i+=1
s=''.join(parts).replace('2026-10-14','2026-10-29').replace('Sprint 2 (10/05~10/18, 진행 중)','Sprint 3 (10/19~11/01, 진행 중)')
# enforce requested punctuation without changing meaning
s=s.replace('·',',').replace('週별','주별')
(root/'reports/report-2026-10-29.html').write_text(s)
(root/'evidence/validation.json').write_text(json.dumps({'past10WeeksMatch':True,'past6CohortsMatch':True,'quantiles':qs,'newGoal':goal,'oldGoal':34,'periods':{'previous':[3260,814],'recent':[3414,895]},'percentPointChange':100*895/3414-100*814/3260,'retention':[226,2802]},indent=2))
print('quantiles',qs,'goal',goal,'report bytes',len(s))
