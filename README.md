# Coursework  Minimization of boolean functions using the Quine method

Quine 
tabular method is a tabular method based on the concept of prime implicants. We know that prime implicant is a product (or sum) term, which can’t be further reduced by combining with any other product (or sum) terms of the given Boolean function.

This tabular method is useful to get the prime implicants by repeatedly using the following Boolean identity.

Procedure of Quine-McCluskey Tabular Method:

Step 1 − Arrange the given min terms in an ascending order and make the groups based on the number of ones present in their binary representations. So, there will be at most ‘n+1’ groups if there are ‘n’ Boolean variables in a Boolean function or ‘n’ bits in the binary equivalent of min terms.

Step 2 − Compare the min terms present in successive groups. If there is a change in only one-bit position, then take the pair of those two min terms. Place this symbol ‘_’ in the differed bit position and keep the remaining bits as it is.

Step 3 − Repeat step2 with newly formed terms till we get all prime implicants.

Step 4 − Formulate the prime implicant table. It consists of set of rows and columns. Prime implicants can be placed in row wise and min terms can be placed in column wise. Place ‘1’ in the cells corresponding to the min terms that are covered in each prime implicant.

Step 5 − Find the essential prime implicants by observing each column. If the min term is covered only by one prime implicant, then it is essential prime implicant. Those essential prime implicants will be part of the simplified Boolean function.

Step 6 − Reduce the prime implicant table by removing the row of each essential prime implicant and the columns corresponding to the min terms that are covered in that essential prime implicant. Repeat step 5 for Reduced prime implicant table. Stop this process when all min terms of given Boolean function are over.

