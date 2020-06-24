## Maxflow datasheet

- keo cot bi cham [x]
  (lag khi bat F12, tat di thi het lag)
- type textarea cham [x]
  (Ly do: set lai full Array, chua co solution => solution: useRef + React.memo)
- hide scroll textarea [x]
- auto tang width khi long text [x]
  (solution: Simulate 1 cai textarea ben tren tag <td>)
- dieu chinh width column cua table [x]

Update 24/6:

- enter long text -> fixed
- click cell ko dc -> fixed, solution: use td tag only instead of using td + textarea
- tang width bi loi -> fix, solution: set min-width for every single cell
- thay doi cau truc bang, khong select dc cell -> fix, solution: run useEffect on every rerender of initArray instead of running once
- copy paste loi khi paste o bien -> []
